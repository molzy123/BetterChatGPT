import useStore from '@store/store';
import SettingsMenu from '@components/SettingsMenu';
import CollapseOptions from './CollapseOptions';
import { TotalTokenCostDisplay } from '@components/SettingsMenu/TotalTokenCost';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || undefined;

const MenuOptions = () => {
  const hideMenuOptions = useStore((state) => state.hideMenuOptions);
  const countTotalTokens = useStore((state) => state.countTotalTokens);
  return (
    <>
      <CollapseOptions />
      <div
        className={`${
          hideMenuOptions ? 'max-h-0' : 'max-h-full'
        } overflow-hidden transition-all`}
      >
        {countTotalTokens && <TotalTokenCostDisplay />}
        {/*<Api />*/}
        <SettingsMenu />
      </div>
    </>
  );
};

export default MenuOptions;
