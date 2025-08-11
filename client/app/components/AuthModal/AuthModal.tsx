import { Button, Divider, Flex, Modal } from 'antd'
import React, { useState } from 'react'
import LoginForm from '../Forms/LoginForm'
import RegisterForm from '../Forms/RegisterForm'

const AuthModal = () => {
    const [modalState,setModalState] = useState({
        open:false,
        type:''
    })

    const modalSwitch = (type:string) => {
        if (type && type !== "") {
            setModalState({
                open:true,
                type:type
            })
        }
    }

    const closeModal = () => {
        setModalState({
                open:false,
                type:''
            })
    }

  return (
    <>
    <Modal onCancel={closeModal}  title={<span className='capitalize'>{modalState?.type} | White Feather's Jewellery</span>} open={modalState?.open} footer={null}>
        <Divider className='!mt-0' />
        {
            modalState?.type === "login" ?
            <LoginForm closeForm={closeModal} switchForm={modalSwitch} /> :
            <RegisterForm closeForm={closeModal} switchForm={modalSwitch} />
        }
    </Modal>
    
    <Flex justify='space-around' className='w-full !my-2'>
        <Button className='button primary' onClick={()=> modalSwitch('login')}>Login</Button>
        <Button className='button secondary' onClick={()=> modalSwitch('register')}>Register</Button>
    </Flex>

    </>
  )
}

export default AuthModal