import { ReactNode } from 'react'
export enum SettingBodyWidth {
  S = 'w-6/12',
  M = 'w-8/12',
  L = 'w-10/12',
}

export interface SettingComponent {
  settingBodySize?: SettingBodyWidth
  title: string
  settingComponent: ReactNode
}

export interface SubSettings {
  subGroupSettingTitle: string
  settings: SettingComponent[]
}
