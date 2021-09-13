using Microsoft.AspNetCore.Identity;

namespace InstAPI.Domain.Models
{
    public class AppUser : IdentityUser
    {
       public string Image {get; set;}
    }

}