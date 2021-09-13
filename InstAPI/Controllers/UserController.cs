using System;
using System.Text;
using System.Threading.Tasks;
using InstAPI.Account;
using InstAPI.Account.Login;
using InstAPI.Account.Registration;
using InstAPI.Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace InstAPI.Controllers
{
    [AllowAnonymous]
    public class UserController : BaseController
    {
        		private readonly UserManager<AppUser> _userManager;

        public UserController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }
        
        [HttpPost("login")]
        public async Task<ActionResult<User>> LoginAsync(LoginQuery query)
        {
            return await Mediator.Send(query);
        }

		[HttpPost("registration")]
		public async Task<ActionResult<User>> RegistrationAsync(RegistrationCommand command)
		{
            
				
			return await Mediator.Send(command);
		}

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                throw new Exception("Error.");
            }
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("Error.");
            }
            var result = await _userManager.ConfirmEmailAsync(user, code);
            if(result.Succeeded)
                throw new Exception("Success confirm your email.");
            else
                throw new Exception("Error.");
            
            
        }
    }
}