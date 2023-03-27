import * as React from 'react';

interface UserFormProps {
  setLogin: Function
}

const UserForm: React.FunctionComponent<UserFormProps> = ({ setLogin }) => {
  const [loginActive, setLoginActive] = React.useState("")

  const Search = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginActive) {
      return;
    }

    setLogin(loginActive);
    setLoginActive("");
  };

  return (
    <>
      <div className='bg-light w-50 p-2 mb-2 rounded'>
            Type your username here:
          <form className="d-flex" onSubmit={Search}>
            <input
              className='w-100'
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={loginActive}
              onChange={(e) => setLoginActive(e.target.value)}
            />
            <input type="submit" value="Search" className="btn btn-dark" />
          </form>
      </div>
    </>
  );
};

export default UserForm;
