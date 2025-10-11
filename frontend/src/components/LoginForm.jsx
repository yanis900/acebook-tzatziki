
export function LoginForm(props) {
    return (
        <form onSubmit={props.handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="text"
          value={props.email}
          onChange={props.handleEmailChange}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={props.password}
          onChange={props.handlePasswordChange}
          required
        />
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
    )
}