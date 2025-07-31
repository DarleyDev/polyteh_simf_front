import Link from 'next/link'
import style from './EssentialLinks.module.scss'
import image from './photo_2025-01-17_15-13-31.jpg'

const data = [
	{
		text: 'Обучение с применением ЭО и ДОТ',
		url: '/our-colleage/special-study',
	},
	{
		text: 'Пройди бесплатное обучение',
		url: '/our-colleage/free-study',
	},
	{
		text: 'АИС «Электронный журнал»',
		url: 'https://edu.rk.gov.ru/authorize',
	},
	{
		text: 'Закрытое образовательное пространство для педагогов, учеников и их родителей  Сферум',
		url: 'https://sferum.ru/?p=start',
	},
	{
		text: 'Вы можете оставить мнение о нашей организации.',
		url: '/our-colleage/mean',
	},
]
const mainurl = `${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/poster.jpg`

function AboutImage() {
	return (
		<>
			<div className={style.links__link}>
				<img src={mainurl} alt='image' />
				<Link href='/our-colleage'>Наш колледж</Link>
			</div>
		</>
	)
}

export default AboutImage
