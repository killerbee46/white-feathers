import { SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import React, { useState } from 'react'
import Link from 'next/link';

const SearchBar = (props:any) => {
    const [text, setText] = useState('')
    const {placeholder,small} = props

    const onChange = (e:string) => {
        setText(e)
    }
    const onSearch = (e:string) => {
        
    }
  return (
    <Input className='!border-[#3892C6] !border-1' placeholder={placeholder || "Search..."} onChange={(e:any)=> onChange(e.target.value)} suffix={<Link href={text && text !== "" ? `products?name=${text}`:"#"}><SearchOutlined /></Link>} size={small ? 'middle' : 'large'} style={{width:props?.half ? "50%" : "100%",}} />
  )
}

export default SearchBar