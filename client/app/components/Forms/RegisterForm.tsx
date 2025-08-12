import { Button, Col, Flex, Form, Input, Row, Space, Typography } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React from 'react'
import '../../styles/_form.scss'

type RegisterTypes = {
    email: String;
    password: String;
}

type RegisterDataTypes = {
    closeForm?: () => void;
    switchForm?: (e:string) => void;
}

const RegisterForm = ({ closeForm, switchForm=(e)=>console.log("error") }: RegisterDataTypes) => {
    const [form] = useForm()

    const onSubmit = (values: RegisterTypes) => {
        console.log(values)
    }
    return (
        <>
            <Form layout='vertical' className='wf_form !p-3 !md:p-5 !py-1'>
                <Form.Item name={'name'} label="Name">
                    <Input />
                </Form.Item>
                <Form.Item name={'email'} label="Email">
                    <Input type='email' />
                </Form.Item>
                <Form.Item name={'phone'} label="Phone">
                    <Input />
                </Form.Item>
                <Form.Item name={'adress'} label="Adress">
                    <Input />
                </Form.Item>
                <Form.Item name={'password'} label="Password">
                    <Input.Password />
                </Form.Item>
                <Form.Item name={'confirm-password'} label="Confirm Password">
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Row gutter={20} justify='space-between' className='!mt-4 !-mb-4'>
                        <Col md={12} xs={24}>
                            <Typography.Paragraph onClick={()=>switchForm("login")} className='text primary cursor-pointer'>Already Have an Account ?</Typography.Paragraph>
                        </Col>
                        <Col md={12} xs={24}>
                        <Flex gap={20} className='w-full justify-end'>
                            <Button onClick={closeForm} className='button danger'>Cancel</Button>
                            <Button className='button success'>Register</Button>
                        </Flex>
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
        </>
    )
}

export default RegisterForm