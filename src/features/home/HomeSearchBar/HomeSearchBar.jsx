import SearchBar from '@entities/SearchBar/SearchBar'

const searchData = [
	{
		keywords: ['Студенту', 'Расписание'],
		link: '/schedule',
		text: 'Распсиание',
	},

	{
		keywords: ['ДПО', 'LGJ', 'Дополнительное профессиональное образование'],
		link: '/our-colleage/dpo-one',
		text: 'Профессиональное обучение и дополнительное профессиональное образование',
	},

	{
		keywords: [
			'Условия обучения инвалидов и лиц с ограниченными возможностями здоровья',
			'Инвалиды',
			'Ограниценный возможности',
		],
		link: '/our-colleage/limited-opportunities',
		text: 'Условия обучения инвалидов и лиц с ограниченными возможностями здоровья',
	},

	{
		keywords: ['Абитуриенту', 'Специальности'],
		link: '/enrollee_new',
		text: 'Абитуриенту, Специальности',
	},

	{
		keywords: ['Контакты', 'Связаться'],
		link: '/contacts',
		text: 'Контакты',
	},

	{
		keywords: ['Устав'],
		link: 'https://simfpolyteh.ru/api/uploads/1713264198801.pdf',
		text: 'Устав',
	},

	{
		keywords: [
			'Правила',
			'Правила распорядка',
			'Правила внутреннего распорядка',
		],
		link: 'https://simfpolyteh.ru/api/uploads/1713265738394.pdf',
		text: 'Правила внутреннего распорядка обучающихся',
	},

	{
		keywords: [
			'Лицензия',
			'Лизенция на осуществление образовательной деятельности',
		],
		link: '/our-colleage/license',
		text: 'Лизенция на осуществление образовательной деятельности',
	},

	{
		keywords: ['Сведения', 'Сведения о результатах приема', 'Прием'],
		link: '/our-colleage/admission-results',
		text: 'Сведения о результатах приема',
	},

	{
		keywords: ['Сведения', 'Сведения о результатах перевода', 'Перевод'],
		link: '/our-colleage/translation-results',
		text: 'Сведения о результатх перевода',
	},

	{
		keywords: ['Руководство'],
		link: '/our-colleage/management',
		text: 'Руководство',
	},

	{
		keywords: [
			'О наличии и условиях предоставления обучающимся стипендии',
			'Стипендия',
		],
		link: '/our-colleage/scholarship',
		text: 'О наличии и условиях предоставления обучающимся стипендии',
	},

	{
		keywords: ['Отчет', 'Обследование', 'Результаты'],
		link: '/our-colleage/self-examination-report',
		text: 'Отчет о результатах обследования',
	},

	{
		keywords: ['Предписания', 'государственный', 'контроль', 'органы'],
		link: '/our-colleage/authority-regulations',
		text: 'Предписания органов, осуществляющих государственный контроль',
	},

	{
		keywords: ['нормативные акты', 'образовательная организация', 'акты'],
		link: '/our-colleage/local-act',
		text: 'Локальные нормативные акты образовательной огранизации',
	},

	{
		keywords: ['образовательные программы', 'реализуемые программы'],
		link: 'relazie-programmers',
		text: 'Реализуемые образовательные программы с указанием учебных предметов, курсов, дисциплин (модулей), практик',
	},
	{
		keywords: ['обучающиеся', 'количество', 'кол-во', 'число'],
		link: '/our-colleage/students-count1',
		text: 'Направление и результаты  (научно-исследовательской) деятельности',
	},
	{
		keywords: ['обучающиеся', 'количество', 'кол-во', 'число'],
		link: '/our-colleage/students-count',
		text: 'Численность обучающихся',
	},

	{
		keywords: ['прием', 'результат'],
		link: '/our-colleage/admission-results',
		text: 'Сведения о результатах приема',
	},

	{
		keywords: ['результаты перевода', 'перевод'],
		link: '/our-colleage/translation-results',
		text: 'Сведения о результатах перевода',
	},

	{
		keywords: ['результат', 'восстановление', 'отчисление'],
		link: '/our-colleage/results-reinstatement-expulsion',
		text: 'Сведения о результатах восстановления и отчисления',
	},

	{
		keywords: ['методика', 'учеба'],
		link: '/our-colleage/union',
		text: 'Учебно-методические объединения',
	},

	{
		keywords: ['стандарт'],
		link: '/fgos-page',
		text: 'Федеральные государственные образовательные стандарты',
	},

	{
		keywords: ['начальство', ''],
		link: '/our-colleage/management',
		text: 'Руководство',
	},

	{
		keywords: ['учителя', 'преподаватели', 'преподавательский состав'],
		link: 'https://simfpolyteh.ru/api/uploads/1728466191918.pdf',
		text: 'Педагогический (научно-педагогический) состав',
	},

	{
		keywords: ['', ''],
		link: '/our-colleage/logistics',
		text: 'Материально-техническое обеспечение и оснащённость образовательного процесса',
	},

	{
		keywords: ['льготы', ''],
		link: '/our-colleage/social-support',
		text: ' О наличии и условиях предоставления обучающимся мер социальной поддержки',
	},

	{
		keywords: ['общага', 'общежитие'],
		link: '/our-colleage/availability-hostel',
		text: 'О наличии общежития',
	},

	{
		keywords: ['комнат', 'жилое', 'помещение'],
		link: '/our-colleage/dormitory-rooms-count',
		text: 'О количестве жилых помещений в общежитии для иногородних обучающихся',
	},

	{
		keywords: ['оплата', 'общежитие'],
		link: '/our-colleage/dormitory-pay',
		text: 'О формировании платы за проживание в общежитии',
	},

	{
		keywords: ['работа', 'трудоустройство', 'вакансии'],
		link: '/our-colleage/employment',
		text: 'О трудоустройстве выпускников',
	},

	{
		keywords: ['', ''],
		link: '/our-colleage/paid',
		text: 'Платные образовательные услуги',
	},

	{
		keywords: ['', ''],
		link: '/our-colleage/financial-economic',
		text: 'Финансово-хозяйственная деятельность',
	},

	{
		keywords: ['', ''],
		link: '/our-colleage/vacancies',
		text: 'Вакантные места для приема (перевода) обучающихся',
	},

	{
		keywords: ['', ''],
		link: '/our-colleage/classrooms',
		text: 'О специально оборудованных учебных кабинетах',
	},

	{
		keywords: ['Вода', 'Озера', 'Реки', 'Море'],
		link: '/our-colleage/water-rules-one',
		text: 'Правила поведения в близи водоемов',
	},

	{
		keywords: ['Проекты', 'Нац проекты'],
		link: 'https://simfpolyteh.ru/our-colleage/nacproject',
		text: "Национальный проект 'Образования'",
	},

	{
		keywords: ['Еда', 'Питание', 'Обед', 'Ужин'],
		link: '/nutrition',
		text: 'Организация питания в образовательной организации',
	},
]

const HomeSearchBar = () => {
	return <SearchBar placeholder={'Поиск по сайту...'} data={searchData} />
}

export default HomeSearchBar
