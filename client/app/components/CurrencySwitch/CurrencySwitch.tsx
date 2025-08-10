import { Button, Flex, Image, Select } from 'antd'
import React from 'react'
import './CurrencySwitch.scss'
import { myCurrency, setCurrency } from '@/app/utils/userCurrency'

const CurrencySwitch = () => {

    const defaultImage = "https://imgs.search.brave.com/2H_DI7__yo5-CYBNVSOaE9LKpCow5x56eY9dEyeOOT0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZGVzaWduZXZvLmNv/bS9yZXMvdGVtcGxh/dGVzL3RodW1iX3Nt/YWxsL2JsdWUtYW5k/LXdoaXRlLW51bWJl/ci1mb3VyLndlYnA"

    const options = [
        {
            label: <Flex align='middle' gap={5}><Image style={{width:20, height:20}} preview={false} src={'/nep.png'} alt='f' />NPR</Flex>,
            value: "npr"
        },
        {
            label: <Flex align='middle' gap={5}><Image style={{width:20, height:20}} preview={false} src={'/usd.png'} alt='f' />USD</Flex>,
            value: "usd"
        },
        {
            label: <Flex align='middle' gap={5}><Image style={{width:22, height:22}} preview={false} src={'/aus.png'} alt='f' />AUD</Flex>,
            value: "aud"
        },
        {
            label: <Flex align='middle' gap={5}><Image style={{width:20, height:20}} preview={false} src={'/eur.png'} alt='f' />EUR</Flex>,
            value: "eur"
        },
    ]

    return (
    <Button className='select-button'>
        <Select onChange={(e)=> setCurrency(e)} suffixIcon={null} className='currency-selector' style={{ width: 90 }} defaultValue={myCurrency} options={options} />
    </Button>    
    )
}

export default CurrencySwitch