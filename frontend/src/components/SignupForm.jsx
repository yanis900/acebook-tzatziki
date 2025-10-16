export function SignupForm(props) {
  return (
    <form onSubmit={props.handleSubmit} className="fieldset">
      <h2 className="text-lg">Create Account</h2>
      <label htmlFor="firstname" className="label">
        Firstname:
      </label>
      <input
        placeholder="Enter Your Firstname"
        id="firstname"
        type="text"
        value={props.firstname}
        onChange={props.handleFirstNameChange}
        required
        className="input "
      />
      <label htmlFor="lastname" className="label">
        Lastname:
      </label>
      <input
        placeholder="Enter Your Lastname"
        id="lastname"
        type="text"
        value={props.lastname}
        onChange={props.handleLastNameChange}
        required
        className="input "
      />
      <label htmlFor="email" className="label">
        Email:
      </label>
      <input
        placeholder="Enter Your Email"
        id="email"
        type="email"
        value={props.email}
        onChange={props.handleEmailChange}
        required
        className="input "
      />
      <label htmlFor="password" className="label">
        Password:
      </label>
      <input
        placeholder="Enter Your Password"
        id="password"
        type="password"
        value={props.password}
        onChange={props.handlePasswordChange}
        minLength={8}
        maxLength={16}
        required
        className="input "
      />
      <label htmlFor="confirm" className="label">
        Confirm Password:
      </label>
      <input
        placeholder="Enter Your Confirm Password"
        id="confirm"
        type="password"
        value={props.confirmPassword}
        onChange={props.handleConfirmPasswordChange}
        required
        className="input"
      />
      <div className="card-body border border-white-300 rounded-box my-2 p-4 max-w-[19.5rem] h-25">
      <h4 className="card-title text-sm m-0.5">Password Requirements:</h4>
      <ul className="list-disc list-outside text-xs pl-4 m-0.5 text-left">
        <li>Minimum 8 characters, maximum 16 characters</li>
        <li>At least 1 capital letter</li>
        <li>At least 1 number</li>
        <li>At least 1 special character</li>
      </ul>
      </div> 
      <div className="flex justify-center mt-4">
          <input
            role="submit-button"
            id="submit"
            type="submit"
            value="Submit"
            className="btn btn-info w-1/2"
            style={{backgroundColor: '#4DBCDB',
            borderColor: '#2B98BA',
            color: 'white'
            }}
          />
        </div>
    </form>
  );
}
