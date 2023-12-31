'use client';

import { useReducer } from 'react';

const initialState = {
  password: '',
  'new-password': '',
  'confirm-password': '',
};

export const PasswordInputs: React.FC = () => {
  const [fields, setFields] = useReducer(
    (
      state: typeof initialState,
      action: React.ChangeEvent<HTMLInputElement>,
    ) => ({
      ...state,
      [action.target.name]: action.target.value,
    }),
    initialState,
  );

  return (
    <>
      <input
        required={!!fields['new-password']}
        className="h-12 w-full rounded bg-white px-3 py-2 text-[#515366]"
        name="password"
        type="password"
        placeholder="Current password"
        minLength={1}
        value={fields.password}
        onChange={setFields}
      />

      <input
        className="h-12 w-full rounded bg-white px-3 py-2 text-[#515366]"
        name="new-password"
        type="password"
        placeholder="New password"
        minLength={1}
        value={fields['new-password']}
        onChange={setFields}
      />
      <input
        required={!!fields['new-password']}
        className="h-12 w-full rounded bg-white px-3 py-2 text-[#515366]"
        name="confirm-password"
        type="password"
        placeholder="Confirm password"
        minLength={1}
        value={fields['confirm-password']}
        onChange={setFields}
      />
    </>
  );
};
