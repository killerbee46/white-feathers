import { Button, Flex, Modal } from 'antd'
import React, { useState } from 'react'

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
        {
            modalState?.type === "login" ?
            "Login Form" :
            "Register Form"
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