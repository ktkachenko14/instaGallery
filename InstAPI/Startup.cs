using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InstAPI.Account.Confirmation;
using InstAPI.Account.Login;
using InstAPI.Account.Security;
using InstAPI.Domain.Models;
using InstAPI.Interfaces;
using InstAPI.Middleware;
using InstAPI.Persistence.Contexts;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using React.AspNet;

namespace InstAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            //services.AddReact();
            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
           /* services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });*/
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlite(
                    Configuration.GetConnectionString("DefaultConnection")));
            

            services.AddDefaultIdentity<AppUser>(options => options.SignIn.RequireConfirmedAccount = true)
                            .AddEntityFrameworkStores<AppDbContext>();

            services.AddTransient<IEmailSender, EmailSender>();
            services.Configure<AuthMessageSenderOptions>(Configuration);
            
            services.AddMediatR(typeof(LoginHandler).Assembly);

            services.AddMvc(option => 
            {
            // Отключаем маршрутизацию конечных точек на основе endpoint-based logic из EndpointMiddleware
            // и продолжаем использование маршрутизации на основе IRouter. 
                    option.EnableEndpointRouting = false;
                    var policy = new AuthorizationPolicyBuilder()
                                        .RequireAuthenticatedUser().RequireAuthenticatedUser().Build();
                    option.Filters.Add(new AuthorizeFilter(policy));
                }).SetCompatibilityVersion(CompatibilityVersion.Latest);

            
           var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("super secret key"));
                        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                        .AddJwtBearer(
                                opt =>
                                    {
                                        opt.TokenValidationParameters = new TokenValidationParameters
                                                                            {
                                                                                ValidateIssuerSigningKey = true,
                                                                                IssuerSigningKey = key,
                                                                                ValidateAudience = false,
                                                                                ValidateIssuer = false,
                                                                            };
                                    });	
            services.AddScoped<IJwtGenerator, JwtGenerator>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
           // app.UseReact(config => { });
            //app.UseHttpsRedirection();
            //app.UseDefaultFiles();
            //app.UseStaticFiles();
            //app.UseSpaStaticFiles();

            app.UseMiddleware<ErrorHandlingMiddleware>();
            app.UseAuthentication();
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            //app.UseHttpsRedirection();
            //app.UseMvc();
            app.UseMvcWithDefaultRoute();
        

           
        }
    }
}
