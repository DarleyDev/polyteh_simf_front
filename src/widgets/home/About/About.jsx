/** @format */

'use client'

import useMediaQuery from '@app/hooks/useMediaQuery'
import logo from '@public/assets/icons/logo.svg?url'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import style from './About.module.scss'
import axios from 'axios'

function About() {
  const [links, setLinks] = useState([])
  const [activeSubMenu, setActiveSubMenu] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const API_BASE_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/linkglobal`

  let isMobile = useMediaQuery('(max-width: 768px)')

  // Fetch links data on mount
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/content`, {
        })
        setLinks(response.data.links || [])
        setActiveSubMenu(Array(response.data.links.length).fill(''))
        setIsLoading(false)
      } catch (err) {
        setError('Не удалось загрузить ссылки')
        setIsLoading(false)
      }
    }
    fetchLinks()
  }, [])

  const mobileHandleClick = (linkText, index) => {
    if (!isMobile) return

    setActiveSubMenu((prevActiveSubMenu) => {
      const newActiveSubMenu = [...prevActiveSubMenu]
      const isOpened = newActiveSubMenu[index]

      if (isOpened) {
        newActiveSubMenu[index] = ''
        return newActiveSubMenu
      }

      newActiveSubMenu.forEach((item, idx) => {
        if (item) newActiveSubMenu[idx] = ''
      })

      newActiveSubMenu[index] = linkText
      return newActiveSubMenu
    })
  }

  const handleMouseEnter = (linkText, index) => {
    if (isMobile) return

    setActiveSubMenu((prevActiveSubMenu) => {
      const newActiveSubMenu = [...prevActiveSubMenu]
      newActiveSubMenu[index] = linkText
      return newActiveSubMenu
    })
  }

  const handleMouseLeave = (index) => {
    if (isMobile) return

    setActiveSubMenu((prevActiveSubMenu) => {
      const newActiveSubMenu = [...prevActiveSubMenu]
      newActiveSubMenu[index] = ''
      return newActiveSubMenu
    })
  }

  if (isLoading) return <div className="text-center mt-8 text-white">Загрузка...</div>
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>

  return (

      <section className={style.about}>
        <div className={style.container}>
      
     
      <div className={style.info}>
        <div className={style.logo}>
          <img src={logo.src} />
        </div>
        <p className={style.title}>Современное образование!</p>
      </div>

      <div className={style.data}>
        <div className={style.card}>
          <p className={style.subInfoTop}>более</p>
          <p className={style.mainInfo}>2000</p>
          <p className={style.subInfoBottom}>студентов</p>
        </div>
        <div className={style.card}>
          <p className={style.subInfoTop}>всего</p>
          <p className={style.mainInfo}>10</p>
          <p className={style.subInfoBottom}>специальностей</p>
        </div>
        <div className={style.card}>
          <p className={style.subInfoTop}>заинтересованных</p>
          <p className={style.mainInfo}>200+</p>
          <p className={style.subInfoBottom}>работодателей</p>
        </div>
      </div>

      <Link href="/enrollee" className={style.getEducationButton}>
        Получи востребованную специальность!
      </Link>
	  <div>
	   <ul className={style.links}>
              {links.map((link, index) => (
                <li
                  key={index}
                  className={style.link}
                  onMouseEnter={() => handleMouseEnter(link.text, index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  onClick={() => mobileHandleClick(link.text, index)}
                >
                  {link.isList ? (
                    <>
                      {link.text}
                      {(activeSubMenu[index] === link.text) && link.subLinks.length > 0 && (
                        <ul className={style.subLinks}>
                          {link.subLinks.map((subLink, subIndex) => (
                            <li key={subIndex}>
                              <Link href={subLink.href || '#'}>{subLink.text || 'Без названия'}</Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link href={link.href}>{link.text}</Link>
                  )}
                </li>
              ))}
            </ul>
	  </div>

	</div>
	</section>
  )
}

export default About
