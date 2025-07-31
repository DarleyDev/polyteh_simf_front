import CreatePage from './CreatePage'
import DeletePage from './DeletePage'
import EssentialLinks from './EditorEssentialLinks'
import EditorPage from './EditorPage'
import HeaderEditor from './HeaderEditor'
import LinksEditor from './MainLinkEditor'
import Ministries from './Ministries'
import style from './Panel.module.scss'
import PosterApp from './PosterEditor'
import SaveFiles from './SaveFiles'
import ScheduleEditor from './ScheduleEditor/ScheduleEditor'
import SwiperInner from './SwiperEditor'

const MainMenu = ({ mainPanelType }) => {
	return (
		<section className={style.main__menu}>
			{mainPanelType === 'create-page' && <CreatePage />}
			{mainPanelType === 'edit-page' && <EditorPage />}
			{mainPanelType === 'delete-page' && <DeletePage />}
			{mainPanelType === 'edit-schedule' && <ScheduleEditor />}
			{mainPanelType === 'editor-page-editor' && <HeaderEditor />}
			{mainPanelType === 'editor-files-editor' && <SaveFiles />}
			{mainPanelType === 'editor-link-main' && <LinksEditor/>}
			{mainPanelType === 'editor-poster' && <PosterApp/>}
			{mainPanelType === 'editor-swiper' && <SwiperInner/>}
			{mainPanelType === 'editor-essential-links' && <EssentialLinks/>}
			{mainPanelType === 'editor-ministries' && <Ministries/>}
		</section>
	)
}

export default MainMenu
