import {
  Affix,
  Col,
  Drawer,
  Flex,
  Row,
  Space,
  Typography,
  Image,
} from "antd";
import { CloseOutlined, MenuOutlined, UpOutlined } from "@ant-design/icons";
import { useState } from "react";
import { MenuItemTypes } from "./Navbar.types";
import SearchBar from "../searchbar/SearchBar";
import LoginHandler from "../LoginHandler/LoginHandler";
import CurrencySwitch from "../CurrencySwitch/CurrencySwitch";
import './Navbar.scss';
import Logo from "../Logo/Logo";

export const Navbar = ({
  menus,
  logo,
}: any) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuSwitch = () => {
    setMenuOpen(!menuOpen);
  };
  const defaultLogo =
    "https://imgs.search.brave.com/mi-mEyLDdGWRrqQRi32s01uwZRgn-fsZm8FU16ZM1Dc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9wbmdp/bWcuY29tL3VwbG9h/ZHMvaW50ZWwvc21h/bGwvaW50ZWxfUE5H/MjQucG5n";
  return (
    <>
      <Affix
        className="navbar_container py-2.5 px-10 bg"
      >
        <Row className="navbar" justify={"space-between"} align={"middle"}>
          <Col lg={3} md={4} sm={6} xs={8}>
            <Logo src={logo} />
          </Col>
          <Col lg={13} md={0} sm={0} xs={0}>
            <Row justify={"start"} style={{ gap: 20 }} className="navMenu">
              {menus?.map((d: MenuItemTypes, i: number) => {
                return (
                  <Col key={i}>
                    <Typography.Link href={d?.path}>
                      <div className="text-black">{d?.label}</div>
                    </Typography.Link>
                  </Col>
                );
              })}
            </Row>
          </Col>
          <Col lg={8} sm={0} md={0} xs={0}>
            <Space size={"large"} style={{ float: "right" }}>
              <SearchBar />
              <CurrencySwitch />
              <LoginHandler />
            </Space>
          </Col>
          <Col
            md={2}
            sm={2}
            xs={2}
            lg={0}
            className="flex justify-end lg:hidden"
          >
            <div className="p-4 cursor-pointer pe-0" onClick={menuSwitch}>
              <MenuOutlined />
            </div>
          </Col>
        </Row>
      </Affix>
      <Drawer
        placement="right"
        open={menuOpen}
        onClose={menuSwitch}
        closable={false}
        className="menu-drawer"
        title={
          <Row justify={"space-between"} align={"middle"}>
            <Col md={4} sm={6} xs={8}>
              <a href="/">
                <Image preview={false} src={logo || defaultLogo} width={'80%'} alt="logo" />{" "}
              </a>
            </Col>
            <Col>
              <LoginHandler />
            </Col>
            <Col>
              <CloseOutlined className="cursor-pointer" onClick={menuSwitch} />
            </Col>
          </Row>

        }
      >
        <Flex vertical>
          {menus?.map((d: MenuItemTypes, i: number) => {
            return (
              <Typography.Link href={d?.path} key={i}>
                <div className="py-1 text-black">{d?.label}</div>
              </Typography.Link>
            );
          })}
          {/* <div className="py-5">
            <LoginHandler />
          </div> */}
        </Flex>
      </Drawer>
    </>
  );
};

export default Navbar;
