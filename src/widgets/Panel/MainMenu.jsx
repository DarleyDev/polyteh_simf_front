import CreatePage from './CreatePage'
import DeletePage from './DeletePage'
import EditorPage from './EditorPage'
import HeaderEditor from './HeaderEditor'
import LinksEditor from './MainLinkEditor'
import style from './Panel.module.scss'
import PosterApp from './PosterEditor'
import SaveFiles from './SaveFiles'
import ScheduleEditor from './ScheduleEditor/ScheduleEditor'

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
		</section>
	)
}

export default MainMenu
