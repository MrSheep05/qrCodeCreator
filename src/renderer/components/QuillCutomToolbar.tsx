import { AppBar, Toolbar } from '@mui/material';
import { useContext } from 'react';
import { AppState } from 'renderer/utils/AppStateComponent';

type Props = {
  innerRef: React.RefObject<HTMLDivElement>;
};
const QuillCustomToolbar = ({ innerRef }: Props) => {
  const { activeEditable } = useContext(AppState).state;
  return (
    <AppBar
      ref={innerRef}
      position="fixed"
      hidden={activeEditable === undefined}
      sx={{
        display: activeEditable === undefined ? 'none' : 'flex',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        width: '80%',
        height: '7vmin',
        backgroundColor: '#ffffff',
        maxHeight: '50px',
        top: 'auto',
        bottom: 0,
        justifyContent: 'center',
        justifySelf: 'center',
        right: 'unset',
      }}
    >
      <Toolbar id="quillToolbar">
        <div>
          <div className="ql-formats">
            <select className="ql-header" defaultValue={'false'}>
              <option value="false"></option>
              <option value="1"></option>
              <option value="2"></option>
              <option value="3"></option>
            </select>
          </div>
          <span className="ql-formats">
            <button className="ql-bold"></button>
            <button className="ql-italic"></button>
            <button className="ql-underline"></button>
            <button className="ql-strike"></button>
          </span>
          <span className="ql-formats">
            <select className="ql-color"></select>
            <select className="ql-background"></select>
          </span>
          <span className="ql-formats">
            <button className="ql-script" value="sub"></button>
            <button className="ql-script" value="super"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-blockquote"></button>
            <button className="ql-code-block"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-list" value="ordered"></button>
            <button className="ql-list" value="bullet"></button>
            <button className="ql-indent" value="-1"></button>
            <button className="ql-indent" value="+1"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-direction" value="rtl"></button>
            <select className="ql-align"></select>
          </span>
          <span className="ql-formats">
            <button className="ql-link"></button>
            <button className="ql-image"></button>
            <button className="ql-video"></button>
            <button className="ql-formula"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-clean"></button>
          </span>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default QuillCustomToolbar;
