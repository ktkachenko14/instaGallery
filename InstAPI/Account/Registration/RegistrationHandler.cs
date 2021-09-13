using System;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using InstAPI.Domain.Models;
using InstAPI.Exceptions;
using InstAPI.Interfaces;
using InstAPI.Persistence.Contexts;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace InstAPI.Account.Registration
{
	public class RegistrationHandler : IRequestHandler<RegistrationCommand, User>
	{
		private readonly UserManager<AppUser> _userManager;
		private readonly IJwtGenerator _jwtGenerator;
		private readonly AppDbContext _context;
		private readonly IEmailSender _sender;

		public RegistrationHandler(AppDbContext context, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IEmailSender sender)
		{
			_context = context;
			_userManager = userManager;
			_jwtGenerator = jwtGenerator;
			_sender = sender;
		}

		public async Task<User> Handle(RegistrationCommand request, CancellationToken cancellationToken)
		{
			if (await _context.Users.Where(x => x.Email == request.Email).AnyAsync())
			{
				throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exist" });
			}

			if (await _context.Users.Where(x => x.UserName == request.UserName).AnyAsync())
			{
				throw new RestException(HttpStatusCode.BadRequest, new { UserName = "UserName already exist" });
			}

			var user = new AppUser
							{
								Email = request.Email,
								UserName = request.UserName
							};

			var result = await _userManager.CreateAsync(user, request.Password);

			if (result.Succeeded)
			{
				
				
				return new User
							{
								Token = _jwtGenerator.CreateToken(user),
								UserName = user.UserName,
								Image = null
								//Id = user.Id
							};
			}

			throw new Exception("Client creation failed");
		}
	}
}