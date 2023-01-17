import { Menu } from '../types/entity'

export const filterMenu = (
  menus: Array<Menu>,
  parentId: number
): Array<any> => {
  const data: Array<any> = []
  menus
    .filter(
      (item) =>
        [1, 2].includes(item.menuType as number) &&
        item.parentId === parentId &&
        item.isDisplay
    )
    .forEach((item) => {
      data.push({
        name: item.menuTitle as string,
        icon: item.icon as string,
        path: item.path as string,
        children: item.isSub ? filterMenu(menus, item.menuId as number) : []
      })
    })
  return data
}
