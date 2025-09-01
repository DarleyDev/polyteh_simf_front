// "use client";

// import { useEffect, useState } from "react";
import ScheduleImage from '@features/Schedule/ScheduleImage/ScheduleImage'
import style from '@pages/Schedule/Schedule.module.scss'
import Link from 'next/link'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import bellImg from '../../../public/assets/images/schedule/bell.jpg'
// import { useAppDispatch, useAppSelector } from "@app/hooks/redux";
// import axios from "axios";

const getFiles = async () => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/files/get?forPage=schedule`,
			{
				next: { revalidate: 0 },
			}
		)

		const data = await response.json()

		return data
	} catch {
		const data = []
		return data
	}
}

const getSchedule = async () => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/schedule/scheduleone`,
			{
				next: { revalidate: 0 },
			}
		)

		const data = await response.json()

		return data
	} catch {
		const data = []
		return data
	}
}

export default async function Schedule() {
	const schedule = await getSchedule()
	const files = await getFiles()
	return (
		<main className={style.scheduleRoot}>
			<h1 className={style.schedule__title}>Расписание</h1>
			<section className={style.schedule__block}>
				<ul className='files-block'>
					{files && files[0] ? (
						files[0].map(({ file, name }) => (
							<li key={name}>
								<Link
									href={`${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/${file}`}
								>
									{name}
								</Link>
							</li>
						))
					) : (
						<p>Загрузка...</p>
					)}
				</ul>
			</section>
			<section className={style.schedule__block}>
				<ul className='files-block'>
					<li>
						<Link href='/our-colleage/zaoch-form'>
							График учебного процесса Заочной формы обучения
						</Link>
					</li>
					<li>
						<Link href='/our-colleage/och-form'>
							График учебного процесса Очной формы обучения
						</Link>
					</li>
				</ul>
			</section>
			<span style={{ marginTop: '1rem' }}>{schedule.date}</span>
			<section className={style.wrapperCorpus}>
				<span>Первый корпус</span>
				{schedule.status !== 'loading' ? (
					<ScheduleImage
						schedule={`${process.env.NEXT_PUBLIC_SERVER_URL}${schedule.scheduleOne}`}
					/>
				) : (
					<article className={style.schedule__loading}>
						<SkeletonTheme baseColor='#202020' highlightColor='#444'>
							<Skeleton className={style.schedule__loading__skeleton} />
						</SkeletonTheme>
					</article>
				)}
			</section>
			<section className={style.wrapperCorpus}>
				<span>Второй корпус</span>
				{schedule.status !== 'loading' ? (
					<ScheduleImage
						schedule={`${process.env.NEXT_PUBLIC_SERVER_URL}${schedule.scheduleTwo}`}
					/>
				) : (
					<article className={style.schedule__loading}>
						<SkeletonTheme baseColor='#202020' highlightColor='#444'>
							<Skeleton className={style.schedule__loading__skeleton} />
						</SkeletonTheme>
					</article>
				)}
			</section>

			<section className={style.schedule__bell}>
				<h2>Расписание звонков</h2>

				<div className={style.schedule__bell__notification}>
					<p>Внимание, уважаемые преподаватели и студенты!</p>
					<p>
						ВНЕСЕНЫ ИЗМЕНЕНИЯ В РАСПИСАНИЕ ЗВОНКОВ И ПРОДОЛЖИТЕЛЬНОСТИ ПЕРЕМЕН!
					</p>
				</div>

				<p>
					На основании Рекомендаций по профилактике новой коронавирусной
					инфекции (COVID-19) в профессиональных образовательных организациях
					(Методические рекомендации МР 3.1/2.4.0206-20) Федеральной службы по
					надзору в сфере защиты прав потребителя и благополучия населения, во
					исполнение письма Министерства образования, науки и молодежи
					Республики Крым
				</p>

				<img
					src="https://simfpolyteh.ru/api/uploads/1756754045370.png"
					alt='Расписание звонков'
				/>
			</section>

			<Link className={style.schedule__all__schedule} href='/all-schedules'>
				Смотреть все расписания
			</Link>
		</main>
	)
}

/* <DaySelector />
				<Favourited data={data} />
				<Corpus title='Первый корпус' data={data.first} />
				<Corpus title='Второй корпус' data={data.second} />
				 */

//	dispatch(loadState())
// const fetchingData = async () => {
// 	try {
// 		const data = await axios.get(
// 			`${process.env.NEXT_PUBLIC_SERVER_URL}/schedule/scheduleone`
// 		)

// 		setDataSchedule({ ...data })
// 	} catch (error) {
// 		console.log(error)
// 	}
// }
// fetchingData()
// const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

// const scheduleOfGroup = [
// 	{ name: 'основы жизни', lecturer: 'Власенко', cabinet: 225 },
// 	{ name: 'инфор. технологии', lecturer: 'Акимова', cabinet: 307 },
// 	{ name: 'БЖД', lecturer: 'Маланьин', cabinet: 216 },
// 	{},
// 	{ name: 'технические штуки', lecturer: 'Клементьев', cabinet: 109 },
// 	{ name: 'история', lecturer: 'Пшеничная', cabinet: 112 },
// ]

// const scheduleLine = [
// 	['12ИСП-В', scheduleOfGroup],
// 	['22ГГВП', scheduleOfGroup],
// 	['12ИСП-П', scheduleOfGroup],
// 	['23ИСП-В', scheduleOfGroup],
// 	['12ИМД', scheduleOfGroup],
// 	['12ИСП-В', scheduleOfGroup],
// ]

// const scheduleData = {
// 	monday: [
// 		scheduleLine,
// 		scheduleLine,
// 		scheduleLine,
// 		scheduleLine,
// 		scheduleLine,
// 	],
// 	tuesday: [
// 		scheduleLine,
// 		scheduleLine,
// 		scheduleLine,
// 		scheduleLine,
// 		scheduleLine,
// 	],
// 	wednesday: [
// 		scheduleLine,
// 		scheduleLine,
// 		scheduleLine,
// 		scheduleLine,
// 		scheduleLine,
// 	],
// 	thursday: [
// 		scheduleLine,
// 		scheduleLine,
// 		scheduleLine,
// 		scheduleLine,
// 		scheduleLine,
// 	],
// 	friday: [
// 		scheduleLine,
// 		scheduleLine,
// 		scheduleLine,
// 		scheduleLine,
// 		scheduleLine,
// 	],
// }

// // TODO: Добавить адаптацию с +- 1250 пикселей

// const data = {
// 	first: scheduleData,
// 	second: scheduleData,
// }
