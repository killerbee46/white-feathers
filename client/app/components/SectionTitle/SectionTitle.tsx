import React from 'react'
import './SectionTitle.scss'

const SectionTitle = ({title, description, underlined, centered}:any) => {
  return (
    <div className={`sectionTitle text-${centered ? "center" : "left"}`}>
        <p className={`title ${underlined ? "underlined" : ""}`}>{title}</p>
        <p className='description'>{description}</p>
    </div>
  )
}

export default SectionTitle