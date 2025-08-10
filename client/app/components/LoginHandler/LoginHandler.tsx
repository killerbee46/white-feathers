import { HeartFilled, ShoppingFilled, UserOutlined } from '@ant-design/icons'
import { Flex, Popover } from 'antd'
import Link from 'next/link'
import React, { useState } from 'react'
import NonAuth from './NonAuth'

const LoginHandler = () => {
    const [loggedIn, setLoggedIn] = useState(false)

    const switchLogin = () => {
        setLoggedIn(!loggedIn)
    }
    return (
        <div>
            <Flex gap={20} className="py-5">
                <Link href={'/wishlist'}>
                    <HeartFilled className="text-xl" />
                </Link>
                <Link href={'/cart'}>
                    <ShoppingFilled className="text-xl" />
                </Link>
                <Link href={''}>
                    <Popover placement="bottomRight" content={<NonAuth />}>
                        <UserOutlined className="text-xl" />
                    </Popover>
                </Link>
            </Flex>
        </div>
    )
}

export default LoginHandler