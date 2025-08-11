import { Button, Col, Flex, Form, Input, Row, Space, Typography } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React from 'react'
import '../../styles/_form.scss'
import Link from 'next/link'

type RegisterTypes = {
    email: String;
    password: String;
}

type RegisterDataTypes = {
    closeForm?: () => void;
    switchForm?: (e:string) => void;
}

const LoginForm = ({ closeForm, switchForm=(e)=>console.log("error") }: RegisterDataTypes) => {
    const [form] = useForm()

    const onSubmit = (values: RegisterTypes) => {
        console.log(values)
    }
    return (
        <>
            <Form layout='vertical' className='wf_form !p-5'>
                <Form.Item name={'email'} label="Email">
                    <Input type='email' />
                </Form.Item>
                <Form.Item name={'password'} label="Password">
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Row gutter={20} justify='space-between' className='!mt-4 !-mb-4'>
                        <Col md={12} xs={24}>
                        <Space direction='vertical'>
                            <Link href={'/forgot-password'} className='text danger'>Forgot Your Password ?</Link>
                            <Typography.Paragraph onClick={()=>switchForm("register")} className='text primary cursor-pointer'>Don't Have an Account ?</Typography.Paragraph>
                        </Space>
                        </Col>
                        <Col md={12} xs={24}>
                        <Space size={'large'}>
                            <Button onClick={closeForm} className='button danger'>Cancel</Button>
                            <Button className='button success'>Login</Button>
                        </Space>
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
        </>
    )
}

export default LoginForm