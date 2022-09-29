import NavItem from "./NavItem"

const navItemList = [
  { title: "메인페이지", path: "/mainpage" },
  { title: "튜토리얼", path: "/tutorial" },
  { title: "강아지 구경", path: "/nft/list" },
  // { title: "커뮤니티", path: "/community" },
  { title: "디자인(개발용)", path: "/styles" },
  { title: "박물관", path: "/museum" },
]

const NavList = () => {
  return (
    <ul>
      {navItemList.map((item, key) => (
        <NavItem title={item.title} path={item.path} key={key} />
      ))}
    </ul>
  )
}

export default NavList
