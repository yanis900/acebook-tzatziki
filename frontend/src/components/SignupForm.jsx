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
      <div className="card-body border border-white-300 rounded-box my-2 p-4">
        <h4 className="card-title">Password Requirements:</h4>
        <ul className="list-disc list-inside text-xs">
          <li>Minimum 8 characters, maximum 16 characters</li>
          <li>At least 1 capital letter</li>
          <li>At least 1 number</li>
          <li>At least 1 special character</li>
        </ul>
      </div>
      <input
        role="submit-button"
        id="submit"
        type="submit"
        value="Submit"
        className="btn"
      />
    </form>
  );
}
