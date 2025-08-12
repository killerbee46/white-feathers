import { Flex, Space, Typography } from 'antd'
import React from 'react'
import AuthModal from '../AuthModal/AuthModal'

const NonAuth = () => {
  return (
    <div className='w-[100%] p-5'>
        <Space direction='vertical' size={'small'}>
            <Typography.Title level={4} className='!m-0'>Your Account</Typography.Title>
            <Typography.Paragraph>Login/Register to access your account</Typography.Paragraph>
        </Space>
        <Flex justify='space-around' className='mx-2'>
            <AuthModal />
        </Flex>
    </div>
  )
}

export default NonAuth