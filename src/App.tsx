import { nanoid } from 'nanoid';
import React, { Reducer, useEffect, useMemo, useReducer, useRef } from 'react';
import { Box, Button, Flex, Image } from 'rebass';
import O_BOTTOM from './images/o-bottom.png';
import O_TOP from './images/o-top.png';
import RE from './images/re.png';

const OREO_TOP = () => <Image alt="O" src={O_TOP} sx={{ transform: 'scale(0.92)' }} />;
const OREO_BOTTOM = () => <Image alt="O" src={O_BOTTOM} sx={{ transform: 'scale(0.92)' }} />;
const OREO_RE = () => <Image alt="RE" src={RE} sx={{ transform: 'scale(0.98)' }} />;
const OREO_SPACE = () => <Box style={{ width: '100px', height: '120px' }} />;

const App = () => {
  const [oreo, { addOTop, addOBottom, addRe, addSpace, removeTop, removeBottom }] = useOreo();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    ref.current?.parentElement?.scrollTo(0, ref.current.getBoundingClientRect().height);
  }, [oreo]);

  return (
    <Flex
      flexDirection="column"
      flex="1"
      alignItems="center"
      justifyContent="flex-end"
      ref={ref}
      style={{ minHeight: '100%' }}
    >
      {oreo.map(({ id, type }, index) => {
        const Component = [OREO_TOP, OREO_BOTTOM, OREO_RE, OREO_SPACE][type];
        const extraStyle = styleOfOeroType(type, index + 1 < oreo.length ? oreo[index + 1].type : undefined);
        return <Box key={id} sx={extraStyle} style={{ zIndex: -index }} children={<Component />} />;
      })}

      <Flex flexDirection="row" justifyContent="center" alignItems="center" sx={controlStyle}>
        <AppButton onClick={addOTop}>O (top)</AppButton>
        <AppButton onClick={addSpace}>&</AppButton>
        <AppButton onClick={addRe}>RE</AppButton>
        <AppButton onClick={addOBottom}>O (bottom)</AppButton>

        {/* <AppButton onClick={removeTop}>Remove Top</AppButton> */}
        <AppButton onClick={removeBottom}>Remove Bottom</AppButton>
      </Flex>
    </Flex>
  );
};

const AppButton = (props: any) => (
  <Button {...props} sx={{ color: 'black', minWidth: '50px', margin: '2px', letterSpacing: '-0.5px' }} />
);
const controlStyle: React.CSSProperties = {
  height: '44px',
  position: 'fixed',
  bottom: 0,
  width: '100%',
  background: 'white',
};

enum OreoTypes {
  O_TOP,
  O_BOTTOM,
  RE,
  SPACE,
}
type Oreo = {
  id: string;
  type: OreoTypes;
};
type OreoState = Oreo[];

enum ActionTypes {
  ADD_O_TOP = 'OREO/ADD/O_TOP',
  ADD_O_BOTTOM = 'OREO/ADD/O_BOTTOM',
  ADD_RE = 'OREO/ADD/RE',
  ADD_SPACE = 'OREO/ADD/SPACE',
  REMOVE_TOP = 'OREO/REMOVE/TOP',
  REMOVE_BOTTOM = 'OREO/REMOVE/BOTTOM',
}
type AddOTopAction = {
  type: ActionTypes.ADD_O_TOP;
};
type AddOBottomAction = {
  type: ActionTypes.ADD_O_BOTTOM;
};
type AddREAction = {
  type: ActionTypes.ADD_RE;
};
type AddSpaceAction = {
  type: ActionTypes.ADD_SPACE;
};
type RemoveTopAction = {
  type: ActionTypes.REMOVE_TOP;
};
type RemoveBottomAction = {
  type: ActionTypes.REMOVE_BOTTOM;
};
type OreoActions =
  | AddOTopAction
  | AddOBottomAction
  | AddREAction
  | AddSpaceAction
  | RemoveTopAction
  | RemoveBottomAction;

const addOTop = () => ({ type: ActionTypes.ADD_O_TOP });
const addOBottom = () => ({ type: ActionTypes.ADD_O_BOTTOM });
const addRe = () => ({ type: ActionTypes.ADD_RE });
const addSpace = () => ({ type: ActionTypes.ADD_SPACE });
const removeTop = () => ({ type: ActionTypes.REMOVE_TOP });
const removeBottom = () => ({ type: ActionTypes.REMOVE_BOTTOM });

const oreoReducer: Reducer<OreoState, OreoActions> = (state, action) => {
  switch (action.type) {
    case ActionTypes.ADD_O_TOP:
      return [
        ...state,
        {
          id: nanoid(),
          type: OreoTypes.O_TOP,
        },
      ];

    case ActionTypes.ADD_O_BOTTOM:
      return [
        ...state,
        {
          id: nanoid(),
          type: OreoTypes.O_BOTTOM,
        },
      ];

    case ActionTypes.ADD_RE:
      return [
        ...state,
        {
          id: nanoid(),
          type: OreoTypes.RE,
        },
      ];

    case ActionTypes.ADD_SPACE:
      return [
        ...state,
        {
          id: nanoid(),
          type: OreoTypes.SPACE,
        },
      ];

    case ActionTypes.REMOVE_TOP:
      if (state.length > 0) {
        const newState = [...state];
        newState.splice(0, 1);
        return newState;
      }
      return state;

    case ActionTypes.REMOVE_BOTTOM:
      if (state.length > 0) {
        const newState = [...state];
        newState.splice(state.length - 1, 1);
        return newState;
      }
      return state;

    default:
      return state;
  }
};

const useOreo = () => {
  const [oreo, dispatch] = useReducer(oreoReducer, []);
  const oreoActions = useMemo(
    () => ({
      addOTop: () => dispatch(addOTop()),
      addOBottom: () => dispatch(addOBottom()),
      addRe: () => dispatch(addRe()),
      addSpace: () => dispatch(addSpace()),
      removeTop: () => dispatch(removeTop()),
      removeBottom: () => dispatch(removeBottom()),
    }),
    [dispatch],
  );

  return [oreo, oreoActions] as const;
};
const styleOfOeroType: (curr: OreoTypes, next: OreoTypes | undefined) => React.CSSProperties = (curr, next) => {
  if (
    (curr === OreoTypes.O_TOP || curr === OreoTypes.O_BOTTOM) &&
    (next === OreoTypes.O_TOP || next === OreoTypes.O_BOTTOM)
  ) {
    return {
      margin: '0 0 -136px',
    };
  }
  if ((curr === OreoTypes.O_TOP || curr === OreoTypes.O_BOTTOM) && next === OreoTypes.RE) {
    return {
      margin: '0 0 -108px',
    };
  }

  if (curr === OreoTypes.RE && next === OreoTypes.RE) {
    return {
      margin: '0 0 -100px',
    };
  }
  if (curr === OreoTypes.RE && (next === OreoTypes.O_TOP || next === OreoTypes.O_BOTTOM)) {
    return {
      margin: '0 0 -118px',
    };
  }

  if (curr === OreoTypes.SPACE && next === undefined) {
    return {
      margin: '0 0 60px',
    };
  }
  if (curr === OreoTypes.SPACE) {
    return {};
  }
  if (next === undefined) {
    return {};
  }

  return {
    margin: '0 0 -100px',
  };
};

export default App;
