import {Image} from 'antd'
import Link from 'next/link'
import React from 'react'

const Logo = ({src}:any) => {
  return (
    <Link href={'/'}>
    <Image preview={false} height={50} className='aspect-square md:!aspect-[7/2]'  src={src} alt='logo' />
    </Link>
  )
}

export default Logo