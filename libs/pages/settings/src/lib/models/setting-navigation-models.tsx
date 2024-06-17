import { ReactNode } from "react"

export interface SettingComponent {
    title: string
    settingComponent: ReactNode
  }
  
  export interface SubSettings {
    subGroupSettingTitle: string
    settings: SettingComponent[]
  }