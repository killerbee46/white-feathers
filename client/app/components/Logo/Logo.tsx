import {Image} from 'antd'
import Link from 'next/link'
import React from 'react'

const Logo = ({src}:any) => {
  return (
    <Link href={'/'}>
    <Image width={'100%'} src={src} alt='logo' />
    </Link>
  )
}

export default Logo