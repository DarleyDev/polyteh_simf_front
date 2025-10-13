import About from '@widgets/home/AboutNew/About'
import axios from 'axios'
// import 'ckeditor5/ckeditor5.css' // Импортируем стили для CKEditor
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import style from './CollegePage.module.scss'
import './style.css'
export default function CollegePage({ params }) {
	const router = useRouter()

	const handleClick = () => {
		router.back()
	}
	const [data, setData] = useState('')
	const handleLinkClickRef = useRef(null)
	useEffect(() => {
		if (typeof window !== 'undefined') {
			handleLinkClickRef.current = href => {
				const serverOut = process.env.NEXT_PUBLIC_SERVER_URL
				Cookies.set('link', `${serverOut}${href}`)
				return true
			}
		}
	}, [])
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/page/pageourcollege`,
					{
						params: { pageUrl: params.collegeId },
					}
				)

				setData(response.data.pageContent)
			} catch (error) {
				console.error(error)
				setData(`${error.response.status}`)
			}
		}

		fetchData()
	}, [params.collegeId])

	// Функция для обработки HTML и обновления путей
// Сделаем функцию глобальной, чтобы она была дост
	// упна для on
	// click
function updateImageSource(text) {
  const link = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4444';
  return text.replace(
    /src\s*=\s*(['"]?)\s*(api\/)?(webview\/)?\/?uploads/g,
    `src=$1${link}/uploads`
  );
}
function insertLocalhostToLinks(html) {
  const serverUrl = process.env.NEXT_PUBLIC_CLOUD_URL || 'http://localhost:4444';
  if (!serverUrl) {
    console.error('NEXT_PUBLIC_SERVER_URL is not defined');
    return html;
  }
  return html.replace(
    /href\s*=\s*(['"]?)\s*(api\/)?(webview\/)?\/?uploads/g,
    `href=$1${serverUrl}/uploads`
  );
}
function updateLinks(htmlContent) {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
  if (!frontendUrl) {
    console.error('NEXT_PUBLIC_FRONTEND_URL is not defined');
    return htmlContent;
  }
  return htmlContent.replace(
    /href\s*=\s*(['"]?)\s*\/our-colleage\//g,
    `href=$1${frontendUrl}/our-colleage/`
  );
}	

	// Обработаем полученные данные
	const processedData = updateImageSource(data)
	const withLocalLinks = insertLocalhostToLinks(processedData)

	const updatedHtml = updateLinks(withLocalLinks)

	// Функция для прокрутки страницы наверх
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth', // Плавная прокрутка
		})
	}
	const id = params.collegeId

	return (
		<>
			<div>
				{id === 'svedeniya_o_organizachi' && <About />}
				{data != 404 && (
					<div className={style.wrapperInter}>
						{data && (
							<div
								className='ck-content'
								dangerouslySetInnerHTML={{
									__html: updatedHtml, // Вставляем отрендеренный HTML
								}}
							/>
						)}
						<button
							style={{
								width: '100%',
								margin: '0 auto',
								display: 'block',
								backgroundColor: '#131313',
								borderRadius: 10,
								padding: 20,
								color: '#FFF',
								fontSize: 24,
							}}
							onClick={handleClick}
						>
							Вернуться назад
						</button>
						<button
							onClick={scrollToTop}
							style={{
								position: 'fixed',
								bottom: '20px',
								right: '20px',
								backgroundColor: '#131313',
								borderRadius: '50%',
								padding: '15px',
								color: '#FFF',
								fontSize: '24px',
								boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
							}}
						>
							↑
						</button>
					</div>
				)}
				{data === 404 && id !== 'svedeniya_o_organizachi' && <NotFoundPage />}
			</div>
		</>
	)
}
