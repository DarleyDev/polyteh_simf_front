import EyeImg from '@public/assets/icons/eye.svg'
import axios from 'axios'
// import 'ckeditor5/ckeditor5.css'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import style from './page.module.scss'
import './style.css'
export default function Post({ params }) {
	const [data, setData] = useState('')
	const [allData, setAllData] = useState([])
	const someData = useSelector(state => state.counter)
	const router = useRouter()

	const handleClick = () => {
		router.back()
	}

	

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
	useEffect(() => {
		const fetchData = async () => {
			try {
				const somedata = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/page/getpagecontent`,
					{ params: { postId: params.postId } }
				)
				console.log('somedata.data', somedata.data)

				// Обрабатываем HTML и обновляем пути
				const processedHtml = updateImageSource(somedata.data.pageContent)
				const withLocalLinks = insertLocalhostToLinks(processedHtml)
				const updatedHtml = updateLinks(withLocalLinks)

				// Обновляем состояние с отрендеренным HTML
				setData(updatedHtml)
			} catch (error) {
				console.error(error)
			}
		}
		fetchData()
	}, [params.postId])

	// Обработка всех данных (например, счетчик просмотров)
	useEffect(() => {
		const fetchAllData = async () => {
			try {
				const mainData = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/page/get`,
					{ params: { url: params.postId } }
				)

				setAllData(mainData.data)
			} catch (error) {
				console.log(error)
			}
		}
		fetchAllData()
	}, [params.postId])

	// Функция для прокрутки страницы наверх
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth', // Плавная прокрутка
		})
	}

	return (
		<div className='main-container'>
			{/* Дожидаемся, когда data будет загружено */}
			{data && (
				<div
					className='ck-content'
					dangerouslySetInnerHTML={{
						__html: data, // Вставляем отрендеренный HTML
					}}
				/>
			)}
			{/* <div className={style.post__views}>
				<span>
					<EyeImg />
					{allData.viewsCount}
				</span>
			</div> */}
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

			{/* Кнопка для прокрутки наверх */}
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
	)
}
