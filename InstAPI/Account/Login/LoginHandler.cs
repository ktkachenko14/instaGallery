using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using InstAPI.Domain.Models;
using InstAPI.Exceptions;
using InstAPI.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace InstAPI.Account.Login
{
    public class LoginHandler : IRequestHandler<LoginQuery, User>
	{
		private readonly UserManager<AppUser> _userManager;

		private readonly SignInManager<AppUser> _signInManager;

		private readonly IJwtGenerator _jwtGenerator;

		public LoginHandler(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IJwtGenerator jwtGenerator)
		{
			_userManager = userManager;
			_signInManager = signInManager;
			_jwtGenerator = jwtGenerator;
		}

		public async Task<User> Handle(LoginQuery request, CancellationToken cancellationToken)
		{
			var user = await _userManager.FindByEmailAsync(request.Email);
			if (user == null)
			{
				throw new RestException(HttpStatusCode.Unauthorized);
			}

			if (user != null)
			{
				if (!await _userManager.IsEmailConfirmedAsync(user))
                {
					throw new Exception("Вы не подтвердили свой email.");
				}
			}
			var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

			if (result.Succeeded)
			{
				return new User
							{
								Token = _jwtGenerator.CreateToken(user),
								UserName = user.UserName,
								Image = null
							};
			}

			throw new RestException(HttpStatusCode.Unauthorized);
		}
	}
}