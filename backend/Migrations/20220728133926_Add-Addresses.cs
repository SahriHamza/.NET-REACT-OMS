using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    public partial class AddAddresses : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Clients",
                type: "varchar(250)",
                maxLength: 250,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<long>(
                name: "AddressId",
                table: "Clients",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomerNumber",
                table: "Clients",
                type: "varchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethod",
                table: "Clients",
                type: "varchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Addresses",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    Street = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    City = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    State = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    Zip = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    Country = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Addresses", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Clients_AddressId",
                table: "Clients",
                column: "AddressId");

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_Addresses_AddressId",
                table: "Clients",
                column: "AddressId",
                principalTable: "Addresses",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Address_AddressId",
                table: "Clients");

            migrationBuilder.DropTable(
                name: "Address");

            migrationBuilder.DropIndex(
                name: "IX_Clients_AddressId",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "AddressId",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "CustomerNumber",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "paymentMethod",
                table: "Clients");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Clients",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(250)",
                oldMaxLength: 250);
        }
    }
}
