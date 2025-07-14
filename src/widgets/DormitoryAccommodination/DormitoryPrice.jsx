'use client'

import { useEffect, useState } from 'react'
import style from './style.module.scss'

const DormitoryPrice = () => {
	const [dormitoryes, setDormitoryes] = useState(null)

	useEffect(() => {
		const getData = async () => {
			const query = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/dormitory/getAll`
			)
			const response = await query.json()
			setDormitoryes(response)
		}

		getData()
	}, [])

	return (
		<section className={style.dormitory__price}>
			<div className={style.dormitory__price__title}>
				<h3>
					Стоимость проживания в общежитии за одно койко-место:
				</h3>
				<p>Для обучающихся Колледжа за счет средств бюджета Республики Крым:</p>
			</div>

			<ul>
				{dormitoryes &&
					dormitoryes.map(({ period, price, forPeopleType }, index) => (
						<li key={index}>
							<h3>{period}</h3>

							<h1>{price}</h1>

							<h6>{forPeopleType}</h6>
						</li>
					))}
			</ul>
		</section>
	)
}

export default DormitoryPrice
