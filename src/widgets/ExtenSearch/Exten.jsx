'use client'
import search from '@public/assets/icons/search.svg?url'
// import 'ckeditor5/ckeditor5.css'
import Link from 'next/link'
import { useState } from 'react'
import style from './style.module.scss'

const SearchPage = () => {
	const [keyword, setKeyword] = useState('')
	const [results, setResults] = useState([])
	const [error, setError] = useState('')
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [isLoading, setIsLoading] = useState(false)

	const processContent = html => {
		if (!html) return html

		// Обновляем пути изображений
		let processedHtml = updateImageSource(html)

		// Обновляем локальные ссылки
		processedHtml = insertLocalhostToLinks(processedHtml)

		// Обновляем ссылки на страницы
		processedHtml = updateLinks(processedHtml)

		return processedHtml
	}

	const updateImageSource = text => {
		const link = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4444'
		return text.replace(
			/src\s*=\s*(['"]?)\s*\/uploads/g,
			`src=$1${link}/uploads`
		)
	}

	const insertLocalhostToLinks = html => {
		const serverUrl =
			process.env.NEXT_PUBLIC_CLOUD_URL || 'http://localhost:4455'
		if (!serverUrl) {
			console.error('NEXT_PUBLIC_SERVER_URL is not defined')
			return html
		}
		const regex = /href\s*=\s*(['"]?)\s*\/uploads/g
		const replacement = `href=$1${serverUrl}/uploads`
		return html.replace(regex, replacement)
	}

	const updateLinks = htmlContent => {
		const frontendUrl =
			process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'
		if (!frontendUrl) {
			console.error('NEXT_PUBLIC_FRONTEND_URL is not defined')
			return htmlContent
		}
		const regex = /href\s*=\s*(['"]?)\s*\/our-colleage\//g
		const replacement = `href=$1${frontendUrl}/our-colleage/`
		return htmlContent.replace(regex, replacement)
	}

	const highlightKeyword = (text, keyword) => {
		if (!text || !keyword) return text

		const regex = new RegExp(`(${keyword})`, 'gi')
		return text.replace(
			regex,
			'<span style="background-color: #0066ff;">$1</span>'
		)
	}

	const handleSearch = async (newPage = 1) => {
		if (!keyword.trim()) {
			setError('Введите ключевое слово для поиска')
			return
		}

		setIsLoading(true)
		try {
			const response = await fetch(
				`${
					process.env.NEXT_PUBLIC_SERVER_URL
				}/page/search-exten?keyword=${encodeURIComponent(
					keyword
				)}&page=${newPage}`
			)
			const data = await response.json()

			if (data.pages.length === 0) {
				setError('Ничего не найдено')
				setResults([])
			} else {
				const processedPages = data.pages.map(page => ({
					...page,
					pageContent: processContent(page.pageContent),
					pageTitle: processContent(page.pageTitle),
				}))

				if (newPage === 1) {
					setResults(processedPages)
				} else {
					setResults(prev => [...prev, ...processedPages])
				}
				setTotalPages(data.totalPages)
				setError('')
			}
		} catch (err) {
			setError('Произошла ошибка при поиске')
			console.error(err)
		} finally {
			setIsLoading(false)
		}
	}

	const handleLoadMore = () => {
		const nextPage = page + 1
		setPage(nextPage)
		handleSearch(nextPage)
	}

	return (
		<div className='relative'>
			<h1 className={style.title}>Поиск страниц</h1>
			<div className={style.searchBar}>
				{/* <img src={search.src} alt='Иконка поиска' /> */}
				<input
					type='text'
					value={keyword}
					onChange={e => setKeyword(e.target.value)}
					placeholder='Введите ключевое слово'
					className={style.input}
				/>
				<button className={style.btnSearch} onClick={() => handleSearch(1)}>
					<img src={search.src} alt='Иконка поиска' />
				</button>
				{keyword && (
					<button
						onClick={() => {
							setKeyword('')
							setResults([])
						}}
						className={style.btnCancel}
					>
						✖
					</button>
				)}
			</div>

			{error && <p className={style.errorMes}>{error}</p>}

			<div>
				{results.map(page => (
					<div
						key={page._id}
						style={{
							marginBottom: '20px',
							border: '1px solid #ccc',
							padding: '10px',
						}}
					>
						<Link
							href={`${
								page.pageType === 'own'
									? 'our-colleage/' + page.pageUrl
									: 'posts/' + page.pageUrl
							}`}
						>
							<h2
								style={{ color: '#00FFFF', textDecoration: 'underline' }}
								dangerouslySetInnerHTML={{
									__html: highlightKeyword(page.pageTitle, keyword),
								}}
							/>
						</Link>

						<p
							onClick={() => {
								window.location.href = `${
									page.pageType === 'own'
										? 'our-colleage/' + page.pageUrl
										: 'posts/' + page.pageUrl
								}`
							}}
							style={{ cursor: 'pointer' }} // Добавляем стиль, чтобы указать, что текст кликабельный
							dangerouslySetInnerHTML={{
								__html: highlightKeyword(page.pageContent, keyword),
							}}
						/>
					</div>
				))}
			</div>

			{page < totalPages && (
				<button onClick={handleLoadMore} disabled={isLoading}>
					{isLoading ? 'Загрузка...' : 'Загрузить еще'}
				</button>
			)}
		</div>
	)
}

export default SearchPage
