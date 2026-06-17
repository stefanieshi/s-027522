import Sidebar from "./components/Sidebar";
import Toast from "./components/Toast";
import Modal from "./components/Modal";
import RadarPoller from "./components/RadarPoller";
import Today from "./pages/Today";
import Calendar from "./pages/Calendar";
import Inbox from "./pages/Inbox";
import Radar from "./pages/Radar";
import Analytics from "./pages/Analytics";
import Voice from "./pages/Voice";
import Settings from "./pages/Settings";
import { useUi } from "./store";
import type { ViewId } from "./lib/types";

const PAGES: Record<ViewId, () => JSX.Element> = {
  today: Today,
  calendar: Calendar,
  inbox: Inbox,
  radar: Radar,
  analytics: Analytics,
  voice: Voice,
  settings: Settings,
};

export default function App() {
  const view = useUi((s) => s.view);
  const Page = PAGES[view];
  return (
    <>
      <Sidebar />
      <main>
        <Page />
      </main>
      <Toast />
      <Modal />
      <RadarPoller />
    </>
  );
}
