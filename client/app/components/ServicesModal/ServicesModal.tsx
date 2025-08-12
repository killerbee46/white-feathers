import { CheckCircleFilled, EnvironmentFilled, HomeFilled, ToolFilled } from '@ant-design/icons'
import { Button, Flex, Modal, Space, Row, Col, Image, Divider } from 'antd'
import Link from 'next/link'
import React, { useState } from 'react'

const mapLink = <Link href={'https://maps.app.goo.gl/PmLyqqQB48KgMFbv9'} target='_blank'>Location Map <EnvironmentFilled /></Link>

const modalData = [
    {
        key: 1,
        title: "Free Try at Home",
        cover: "",
        info: [],
        form: true,
    },
    {
        key: 2,
        title: "Customize your design",
        cover: '/custom-des.png',
        info: [
            "Get on a live video call with our design consultants.",
            "Live Available On Whatsapp, Viber & Messenger!",
            "SUN - SAT ( 9am to 6pm )",
            `OPENS 365 DAYS! ${mapLink}`
        ],
        form: false,
    },
    {
        key: 3,
        title: "Sell your gold or jewelleries",
        cover: '/jwell-sell.webp',
        info: [
            "Get on a live video call with our design consultants.",
            "Live Available On Whatsapp, Viber & Messenger!",
            "SUN - SAT ( 9am to 6pm )",
            `OPENS 365 DAYS! ${mapLink}`
        ],
        form: false,
    },
]

const ServicesModal = () => {
    const [modalState, setModalState] = useState({
        open: false,
        type: 0
    })

    const modalSwitch = (type: number) => {
        if (type && type !== 0) {
            setModalState({
                open: true,
                type: type
            })
        }
    }

    const closeModal = () => {
        setModalState({
            open: false,
            type: 0
        })
    }

    const activeData = modalData?.find((f) => f?.key === modalState?.type)

    const ModalContent = () => {
        return <div>
            {
                activeData?.form ? 
                "Free Try at home" :
                <>
                {
                activeData?.cover && activeData?.cover !== "" ?
                    // <Image preview={false} className='w-full aspect-[7/3]' src={activeData?.cover} alt='' /> 
                    <div className='w-full aspect-[7/3]' style={{
                        background:`url(${activeData?.cover})`,
                        backgroundSize:'cover',
                    }} /> 
                    
                    :
                    null
            }
            <Row gutter={10} justify={'center'} align={'middle'} className='my-2'>
                <Col lg={8} xs={6}>
                    <Image preview={false} className='w-full aspect-square' src={'./wa-qr.jpg'} alt='' />
                </Col>
                {
                    activeData?.info && activeData?.info?.length !== 0 &&
                    <Col lg={16} sm={18}>
                        {
                            activeData?.info?.map((inf,i) => {
                                return <div className='w-full overflow-auto'>
                                    <CheckCircleFilled className='!text-green-600' />{" "+inf} 
                                </div>
                            })
                        }
                        <CheckCircleFilled className='!text-green-600' />{" "}{mapLink}
                    </Col>

                }
            </Row>
                </>
            }
        </div>
    }

    return (
        <>
            <Modal className='w-[90%] lg:!w-[50%]' onCancel={closeModal} title={<span className='capitalize'>{activeData?.title}</span>} open={modalState?.open} footer={null}>
                <Divider className='!mt-0' />
                <ModalContent />
            </Modal>
            <Flex justify='space-around' className='w-full'>
                <Space onClick={() => modalSwitch(1)} className='!text-white cursor-pointer md:!text-[14px] !text-[12px]'>
                    <HomeFilled /> Free Try At Home
                </Space>
                <Space onClick={() => modalSwitch(2)} className='!text-white cursor-pointer md:!text-[14px] !text-[12px]'>
                    <ToolFilled /> Custom Design
                </Space>
                <Button className='!text-blue-600 border-1 border-blue-600 my-1 !text-[12px] !px-1 md:!px-[5px]' onClick={() => modalSwitch(3)}>Sell Gold / Jewelleries</Button>
            </Flex>

        </>
    )
}

export default ServicesModal