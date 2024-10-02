package com.wx.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
// import org.springframework.boot.Banner;

@SpringBootApplication
@ComponentScan
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(DemoApplication.class);
		// Close the Banner
        // app.setBannerMode(Banner.Mode.OFF);
		/**
		 * Set the additional profile
		 * The additional profile is used to load the corresponding configuration file
		 * according to the profile name
		 * For example, if the additional profile is set to "dev", the application will
		 * load the application-dev.properties configuration file
		 * If the additional profile is set to "prod", the application will load the
		 * application-prod.properties configuration file
		 * If the additional profile is not set, the application will load the
		 * application.properties configuration file
		 */
		// app.setAdditionalProfiles("dev");
        app.run(args);
	}

}
