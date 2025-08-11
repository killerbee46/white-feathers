import { Row, Col, Popover, Flex, Image } from 'antd';
import React from 'react'
import { MenuItemTypes } from './Navbar.types';
import Link from 'next/link';
import SectionTitle from '../SectionTitle/SectionTitle';

const restDataGen = (type: string) => {
    switch (type) {
        case "preference":
            return {
                title: "Shop By Preference",
                children: [
                    { label: "For Men", value: "&for=men" },
                    { label: "For Women", value: "&for=women" },
                    { label: "For Kids", value: "&for=kids" }
                ]
            }
        case "price":
            return {
                title: "Shop By Price",
                children: [
                    { label: "Under 10k", value: "&minPrice=0&maxPrice=10000" },
                    { label: "10k - 20k", value: "&minPrice=10000&maxPrice=20000" },
                    { label: "20k - 50k", value: "&minPrice=20000&maxPrice=50000" },
                    { label: "50k - 100k", value: "&minPrice=50000&maxPrice=100000" },
                    { label: "100k - 200k", value: "&minPrice=100000&maxPrice=200000" },
                    { label: "Over 200k", value: "&minPrice=200000" },
                ]
            }

        default:
            return
    }
}

const SubMenuContainer = ({ menus, label }: any) => {
    const first = menus?.slice(0, 1)[0]
    const rest = menus?.slice(1, menus?.length)
    const baseUrl = `/products?name=%20${label.toLowerCase()}%20`
    return (
        <div className='w-[99vw] min-h-100 max-h-180 p-5'>
            <Row>
                <Col span={10}>
                    <SectionTitle underlined title={first?.title} />

                    <Flex vertical className='flex-wrap !mt-1'>
                        {
                            first?.children?.map((child: any) => {
                                return <Link href={baseUrl + child?.label.toLowerCase() + "%20"}>
                                    <Flex align='center' gap={8} className='!my-2 group cursor-pointer'>
                                        <Image preview={false} className='!w-8' src='/wf-logo-small.svg' /> <div className='text-normal group-hover:font-bold'>{child?.label}</div>
                                    </Flex>
                                </Link>
                            })
                        }
                    </Flex>
                </Col>
                <Col span={10}>
                    <Flex vertical gap={20}>
                        {
                            rest?.map((r: any) => {
                                const data = restDataGen(r?.type)
                                return (
                                    <div>
                                        <SectionTitle underlined title={data?.title} />

                                        <Flex vertical className='flex-wrap !mt-1'>
                                            {
                                                data?.children?.map((child: any) => {
                                                    return <Link href={baseUrl + child?.value}>
                                                        <Flex align='center' className='!my-0.5 group cursor-pointer'>
                                                            <div className='text-normal group-hover:font-bold'>{child?.label}</div>
                                                        </Flex>
                                                    </Link>
                                                })
                                            }
                                        </Flex>
                                    </div>
                                )
                            })
                        }
                    </Flex>
                </Col>
                <Col span={4}>
                    <Image preview={false} className='!w-full aspect-square' src='/wf-logo-small.svg' />
                </Col>
            </Row>
        </div>
    )
}

const NavMenus = ({ menus }: any) => {
    return (
        <Row justify={"start"} style={{ gap: 20 }} className="navMenu px-2">
            {menus?.map((d: MenuItemTypes, i: number) => {
                return (
                    <Col key={i}>
                        {
                            d?.children && d?.children?.length !== 0 ?
                                <Popover placement='bottom' content={<SubMenuContainer label={d?.label} menus={d?.children} />}>
                                    <Link href={`/products?name=%20${d?.label.toLowerCase()}%20`} className='menu-item'>
                                        {d?.label}
                                    </Link>
                                </Popover>
                                :
                                <Link href={d?.path} className='menu-item'>
                                    {d?.label}
                                </Link>
                        }
                    </Col>
                );
            })}
        </Row>
    )
}

export default NavMenus