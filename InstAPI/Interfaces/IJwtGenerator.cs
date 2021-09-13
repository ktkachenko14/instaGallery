using InstAPI.Domain.Models;

namespace InstAPI.Interfaces
{
    public interface IJwtGenerator
    {
        string CreateToken(AppUser user);
    }
}