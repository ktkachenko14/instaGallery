using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InstAPI.Domain.Models;
using InstAPI.Persistence.Contexts;
using Microsoft.AspNetCore.Identity;

namespace InstAPI.Migrations
{
    public class DataSeed
    {
        public static async Task SeedDataAsync(AppDbContext context, UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                                {
                                    new AppUser
                                        {
                                            UserName = "ktkachenko",
                                            Email = "karina.tkachenko14@gmail.com"
                                        }
                                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Qwerty_21");
                }
            }
        }
    }
}