from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..models import UserSettings
from ..db import supabase
from datetime import datetime

router = APIRouter(
    prefix="/user-settings",
    tags=["user_settings"],
)


@router.get("/{user_id}", response_model=UserSettings)
async def get_user_settings(user_id: str):
    """ユーザー設定を取得する"""
    try:
        response = supabase.table("user_settings").select("*").eq("user_id", user_id).execute()
        
        if not response.data:
            return UserSettings(
                user_id=user_id,
                primary_color="#3498db",
                secondary_color="#2ecc71",
                font_family="Arial"
            )
        
        return UserSettings(**response.data[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ユーザー設定の取得に失敗しました: {str(e)}")


@router.post("/", response_model=UserSettings)
async def create_user_settings(settings: UserSettings):
    """ユーザー設定を作成または更新する"""
    try:
        now = datetime.now()
        
        response = supabase.table("user_settings").select("*").eq("user_id", settings.user_id).execute()
        
        if response.data:
            settings_dict = settings.dict(exclude={"id", "created_at"})
            settings_dict["updated_at"] = now
            
            response = supabase.table("user_settings").update(settings_dict).eq("user_id", settings.user_id).execute()
            return UserSettings(**response.data[0])
        else:
            settings_dict = settings.dict()
            settings_dict["created_at"] = now
            settings_dict["updated_at"] = now
            
            response = supabase.table("user_settings").insert(settings_dict).execute()
            return UserSettings(**response.data[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ユーザー設定の保存に失敗しました: {str(e)}")
