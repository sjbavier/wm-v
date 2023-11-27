declare interface AppProps {
  children?: React.ReactNode; // best, accepts everything React can render
  childrenElement: JSX.Element; // A single React element
  style?: React.CSSProperties; // to pass through style props
  onChange?: React.FormEventHandler<HTMLInputElement>; // form events! the generic parameter is the type of event.target
  //  more info: https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/#wrappingmirroring

  message: string;
  count: number;
  disabled: boolean;
  /** array of a type! */
  names: string[];
  /** string literals to specify exact string values, with a union type to join them together */
  status: 'waiting' | 'success';
  /** an object with known properties (but could have more at runtime) */
  obj: {
    id: string;
    title: string;
  };
  /** array of objects! (common) */
  objArr: {
    id: string;
    title: string;
  }[];
  /** any non-primitive value - can't access any properties (NOT COMMON but useful as placeholder) */
  obj2: object;
  /** an interface with no required properties - (NOT COMMON, except for things like `React.Component<{}, State>`) */
  obj3: {};
  /** a dict object with any number of properties of the same type */
  // dict1: {
  //   [key: string]: MyTypeHere;
  // };
  // dict2: Record<string, MyTypeHere>; // equivalent to dict1
  /** function that doesn't take or return anything (VERY COMMON) */
  // onClick: () => void;
  // /** function with named prop (VERY COMMON) */
  // onChange: (id: number) => void;
  // /** function type syntax that takes an event (VERY COMMON) */
  // onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // /** alternative function type syntax that takes an event (VERY COMMON) */
  // onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  // /** any function as long as you don't invoke it (not recommended) */
  // onSomething: Function;
  // /** an optional prop (VERY COMMON!) */
  // optional?: OptionalType;
  // /** when passing down the state setter function returned by `useState` to a child component. `number` is an example, swap out with whatever the type of your state */
  // setState: React.Dispatch<React.SetStateAction<number>>;
  // props: Props & React.ComponentPropsWithoutRef<"button">; // to impersonate all the props of a button element and explicitly not forwarding its ref
  // props2: Props & React.ComponentPropsWithRef<MyButtonWithForwardRef>; // to impersonate all the props of MyButtonForwardedRef and explicitly forwarding its ref
}
// ***
// ***
// API
// ***
// ***
declare type TRequest = {
  method: string;
  path: string;
  data?: any;
  token?: string;
};

declare type TLoginResponse = {
  userId: number;
  user: string;
  role: string;
  access_token?: string;
  message: string;
};

// ***
// ***
// Views
// ***
// ***
declare interface IBookmarks {
  title: string;
  bookmark_id: number;
  categories_collection: ICategory[];
  link: string;
}

declare interface ICategory {
  name: string;
  category_id: number;
}

declare interface DivWrapper extends React.HTMLAttributes<HTMLDivElement> {
  // onClick?: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  props?: Props & React.ComponentPropsWithoutRef<'div'>; // to impersonate all the props of a button element and explicitly not forwarding its ref
  callback?: Function;
}

declare type TResponseReferenceStructure = {
  hash: string;
  path: string;
  reference_structure_id: number;
  structure?: string;
};

declare type TStructure = {
  children?: TStructure[];
  name: string;
  path: string;
  type: 'directory' | 'file' | 'hidden';
};

declare type Graphic = {
  description: string;
  url: string;
};
// ***
// ***
// Authentication
// ***
// ***
declare type TAuthResponse = {
  userId: number;
  user: string;
  role: string;
  message: string;
  msg?: string;
};

declare interface IAuthState {
  userId?: string;
  user?: string;
  scopes?: string[];
  token?: string;
  error?: string;
  loading?: boolean;
}

declare interface IAuthAction {
  type: string;
  payload?: IAuthState;
}

declare interface IAuthContext extends IAuthState {
  fetchUser: any;
  dispatchAuth: any;
}
