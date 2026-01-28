import { Column, Model, Table } from "sequelize-typescript";

export interface SettingsAttributes {
  readonly hardMode: boolean;
}

@Table({
  timestamps: false,
})
export class Settings
  extends Model<SettingsAttributes, Partial<SettingsAttributes>>
  implements SettingsAttributes
{
  @Column
  hardMode!: boolean;
}
