import { ipcRendererSend } from "@/common/ipc-util/renderer";
import SvgAsset from "../SvgAsset";
import "./index.scss";
import { showModal } from "../Modal";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import HeaderNavigator from "./widgets/Navigator";
import Evt from "@/renderer/core/events";
import rendererAppConfig from "@/common/app-config/renderer";
import { musicDetailShownStore } from "../MusicDetail";
import Condition from "../Condition";
import SearchHistory from "./widgets/SearchHistory";
import { addSearchHistory } from "@/renderer/utils/search-history";

export default function AppHeader() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>();
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const isHistoryFocusRef = useRef(false);

  if (!showSearchHistory) {
    isHistoryFocusRef.current = false;
  }

  function onSearchSubmit() {
    if (inputRef.current.value) {
      search(inputRef.current.value);
    }
  }

  function search(keyword: string) {
    navigate(`/main/search/${keyword}`);
    musicDetailShownStore.setValue(false);
    addSearchHistory(keyword);
    setShowSearchHistory(false);
  }

  return (
    <div className="header-container">
      <div className="left-part">
        <div className="logo">
          <SvgAsset iconName="logo"></SvgAsset>
        </div>
        <HeaderNavigator></HeaderNavigator>
        <div id="header-search" className="header-search">
          <input
            ref={inputRef}
            className="header-search-input"
            placeholder="在这里输入搜索内容"
            maxLength={50}
            onClick={() => {
              setShowSearchHistory(true);
            }}
            onKeyDown={(key) => {
              if (key.key === "Enter") {
                onSearchSubmit();
              }
            }}
            onFocus={() => {
              setShowSearchHistory(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                if (!isHistoryFocusRef.current) {
                  setShowSearchHistory(false);
                }
              }, 0);
            }}
          ></input>
          <div className="search-submit" role="button" onClick={onSearchSubmit}>
            <SvgAsset iconName="magnifying-glass"></SvgAsset>
          </div>
          <Condition condition={showSearchHistory}>
            <SearchHistory
              onHistoryClick={(item) => {
                search(item);
              }}
              onHistoryPanelBlur={() => {
                isHistoryFocusRef.current = false;
                setShowSearchHistory(false);
              }}
              onHistoryPanelFocus={() => {
                isHistoryFocusRef.current = true;
                console.log("FOCUS");
                setShowSearchHistory(true);
              }}
            ></SearchHistory>
          </Condition>
        </div>
      </div>

      <div className="right-part">
        <div
          role="button"
          className="header-button sparkles-icon"
          onClick={() => {
            showModal("Sparkles");
          }}
        >
          <SvgAsset iconName="sparkles"></SvgAsset>
        </div>
        <div className="header-divider"></div>
        <div
          role="button"
          className="header-button"
          title="设置"
          onClick={() => {
            navigate("/main/setting");
            Evt.emit("HIDE_MUSIC_DETAIL");
          }}
        >
          <SvgAsset iconName="cog-8-tooth"></SvgAsset>
        </div>
        <div
          role="button"
          title="最小化"
          className="header-button"
          onClick={() => {
            ipcRendererSend("min-window", {});
          }}
        >
          <SvgAsset iconName="minus"></SvgAsset>
        </div>
        <div
          role="button"
          title="退出"
          className="header-button"
          onClick={() => {
            const exitBehavior = rendererAppConfig.getAppConfigPath(
              "normal.closeBehavior"
            );
            if (exitBehavior === "minimize") {
              ipcRendererSend("min-window", {
                skipTaskBar: true,
              });
            } else {
              ipcRendererSend("exit-app");
            }
          }}
        >
          <SvgAsset iconName="x-mark"></SvgAsset>
        </div>
      </div>
    </div>
  );
}
