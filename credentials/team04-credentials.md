1. ec2-54-153-96-174.us-west-1.compute.amazonaws.com
2. ubuntu
3. t4-server.pem <strong> (.pem file located in credentials folder)</strong>
4. ec2-50-18-92-114.us-west-1.compute.amazonaws.com | 3306
5. t4access
6. t4DBpassword$
7. t4db

# How to Connect to the Server: 
  1. To access the server, first place the .pem file in your .ssh folder:

         open ~/.ssh
         
  2. Once .pem file is inside the .ssh folder, use chmod to set permissions to use the key:

         chmod 400 ~/.ssh/team04.pem
         
  3. After doing the above step, ssh into the server using the following command:

         ssh -i ~/.ssh/team04.pem ubuntu@ec2-13-56-252-119.us-west-1.compute.amazonaws.com
       Type in "yes" when prompted to add your instance as a known host.
       
  4. <strong>Celebrate</strong>! You are now connected!

# How to Connect to the Database: 
  1. To access the database, go to MySQLWorkbench and click on the wrench next to "MySQL Connections"

  2. Type in the following for each of the fields:
     
         HOSTNAME: ec2-54-153-96-174.us-west-1.compute.amazonaws.com
         PORT: 3306
         USER: t4access
         PASSWORD: t4DBpassword$

   3. Once you filled in the field, test your connection to check if you're connected

   4. If connection succeeded, then <strong>Celebrate</strong>!



