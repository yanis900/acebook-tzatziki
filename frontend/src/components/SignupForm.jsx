export function SignupForm(props) {
    return (
        <form onSubmit={props.handleSubmit}>
        <label htmlFor="firstname">Firstname:</label>
        <input
          id="firstname"
          type="text"
          value={props.firstname}
          onChange={props.handleFirstNameChange}
          required
        />
        <label htmlFor="lastname">Lastname:</label>
        <input
          id="lastname"
          type="text"
          value={props.lastname}
          onChange={props.handleLastNameChange}
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={props.email}
          onChange={props.handleEmailChange}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          placeholder="Password"
          id="password"
          type="password"
          value={props.password}
          onChange={props.handlePasswordChange}
          minLength={8}
          maxLength={16}
          required
        />
        <label htmlFor="confirm">Confirm Password:</label>
        <input
          placeholder="Confirm Password"
          id="confirm"
          type="password"
          value={props.confirmPassword}
          onChange={props.handleConfirmPasswordChange}
          required
        />
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
    )
}