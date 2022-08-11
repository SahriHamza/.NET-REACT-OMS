using Microsoft.EntityFrameworkCore;
namespace backend.Data
{
    public class ClientsContext: DbContext
    {
        public ClientsContext(DbContextOptions<ClientsContext> options)
            : base(options)
        {
        }

        public DbSet<Address> Addresses { get; set; }

        public DbSet<Client> Clients { get; set; }


        public DbSet<Product> Products { get; set; }

        public DbSet<Warehouse> Warehouses { get; set; }

        public DbSet<Stocks> Stocks { get; set; }

        public DbSet<Order> Orders { get; set; }

        public DbSet<OrderLine> OrderLines { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Stocks>().HasNoKey();
            modelBuilder.Entity<Order>()
                .Property(u => u.Status)
                .HasConversion<string>()
                .HasMaxLength(50);
        }
    }
}
